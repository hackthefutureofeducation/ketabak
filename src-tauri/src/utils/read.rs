use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    let path_buf = PathBuf::from(path);

    // Validate file extension
    if !path_buf.extension().map_or(false, |ext| ext == "ketabi") {
        return Err("Invalid file type. Only .ketabi files are allowed.".to_string());
    }

    // Check file size before reading
    if let Ok(metadata) = std::fs::metadata(&path_buf) {
        const MAX_FILE_SIZE: u64 = 10 * 1024 * 1024; // 10MB limit
        if metadata.len() > MAX_FILE_SIZE {
            return Err("File too large. Maximum size is 10MB.".to_string());
        }
    }

    match fs::read_to_string(path_buf) {
        Ok(contents) => Ok(contents),
        Err(_) => Err("Failed to read file.".to_string()),
    }
}
