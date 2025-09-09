mod utils;

use utils::epub::generate_epub;
use utils::read::read_file;
use utils::sync::sync;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_file, sync, generate_epub])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
