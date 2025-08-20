use anyhow::{bail, Context, Result};
use chrono::{DateTime, Utc};
use epub_builder::{EpubBuilder, EpubContent, ReferenceType, ZipLibrary};
use regex::Regex;
use serde::Deserialize;
use std::fs::File;
use std::io::Cursor;
use std::path::Path;

#[derive(Debug, Deserialize)]
pub struct Meta {
    pub title: String,
    pub publisher: Option<String>,
    pub language: Option<String>,
    pub identifier: Option<String>,
    pub description: Option<String>,
    pub modified: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct Page {
    pub id: String,
    pub title: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct Input {
    pub meta: Meta,
    pub pages: Vec<Page>,
}

pub fn generate(data: &Input, output_path: &str) -> Result<()> {
    if data.meta.title.trim().is_empty() {
        bail!("meta.title is required");
    }
    if data.pages.is_empty() {
        bail!("pages cannot be empty");
    }

    let mut epub = EpubBuilder::new(ZipLibrary::new().context("zip lib")?)?;

    // ---- Metadata ----
    epub.metadata("title", &data.meta.title).ok();
    if let Some(id) = &data.meta.identifier {
        epub.metadata("identifier", id).ok();
    }
    if let Some(lang) = &data.meta.language {
        epub.metadata("language", lang).ok();
    }
    if let Some(publi) = &data.meta.publisher {
        epub.metadata("publisher", publi).ok();
    }
    if let Some(desc) = &data.meta.description {
        epub.metadata("description", desc).ok();
    }
    let modified = data.meta.modified.unwrap_or_else(|| Utc::now());
    epub.metadata("modified", &modified.to_rfc3339()).ok();

    // ---- Pages ----
    for (idx, page) in data.pages.iter().enumerate() {
        let title = if page.title.trim().is_empty() {
            format!("Chapter {}", idx + 1)
        } else {
            page.title.trim().to_string()
        };

        let xhtml = wrap_as_xhtml(&title, &page.content);
        let filename = format!("{:02}-{}.xhtml", idx + 1, slug(&page.title));
        let reader = Cursor::new(xhtml.into_bytes());

        epub.add_content(
            EpubContent::new(filename, reader).title(title).reftype(ReferenceType::Text),
        )?;
    }

    let out = File::create(Path::new(output_path))?;
    epub.inline_toc();
    epub.generate(out)?;
    Ok(())
}

// ---- Helpers ----

fn wrap_as_xhtml(title: &str, html_fragment: &str) -> String {
    let body = if html_fragment.trim().is_empty() {
        "&nbsp;".to_string()
    } else {
        html_fragment.to_string()
    };

    format!(
        r##"<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
</head>
<body>
{body}
</body>
</html>
"##,
        title = xml_escape(title),
        body = body
    )
}

fn slug(s: &str) -> String {
    let re = Regex::new(r"[^\p{L}\p{N}]+").unwrap();
    let s = re.replace_all(s, "-");
    let s = s.trim_matches('-');
    if s.is_empty() {
        "page".to_string()
    } else {
        s.to_lowercase()
    }
}

fn xml_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}

#[command]
pub async fn generate_epub(json: String, output_path: String) -> Result<String, String> {
    let parsed: Input = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    generate(&parsed, &output_path).map_err(|e| e.to_string())?;
    Ok(output_path)
}
