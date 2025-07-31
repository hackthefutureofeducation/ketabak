use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

use flate2::write::GzEncoder;
use flate2::Compression;
use serde_json::Value;

#[tauri::command]
pub fn sync(json: Value, path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);

    // Validate file extension
    if !path_buf.extension().map_or(false, |ext| ext == "ketabi") {
        return Err("Invalid file type. Only .ketabi files are allowed.".to_string());
    }

    // Serialize JSON object to string
    let json_str =
        serde_json::to_string(&json).map_err(|_| "Failed to serialize JSON".to_string())?;

    // Compress JSON
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(json_str.as_bytes()).map_err(|_| "Compression failed".to_string())?;
    let compressed = encoder.finish().map_err(|_| "Compression finish failed".to_string())?;

    // Write to file
    let mut file = File::create(path_buf).map_err(|_| "Failed to create file".to_string())?;
    file.write_all(&compressed).map_err(|_| "Failed to write file".to_string())?;
    Ok(())
}
