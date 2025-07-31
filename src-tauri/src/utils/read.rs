use std::fs::File;
use std::io::{BufReader, Read};
use std::path::PathBuf;

use flate2::read::GzDecoder;
use serde_json::Value;

#[tauri::command]
pub fn read_file(path: String) -> Result<Value, String> {
    let path_buf = PathBuf::from(path);

    // Validate file extension
    if !path_buf.extension().map_or(false, |ext| ext == "ketabi") {
        return Err("Invalid file type. Only .ketabi files are allowed.".to_string());
    }

    // Open and read the file
    let file = File::open(path_buf).map_err(|_| "Failed to open file".to_string())?;
    let mut decoder = GzDecoder::new(BufReader::new(file));
    let mut decompressed = String::new();
    decoder
        .read_to_string(&mut decompressed)
        .map_err(|_| "Failed to decompress or read file".to_string())?;

    // Parse JSON
    let json: Value =
        serde_json::from_str(&decompressed).map_err(|_| "Failed to parse JSON".to_string())?;

    Ok(json)
}
