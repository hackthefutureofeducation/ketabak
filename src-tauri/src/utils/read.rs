use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    let path_buf = PathBuf::from(path);
    match fs::read_to_string(path_buf) {
        Ok(contents) => Ok(contents),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}
