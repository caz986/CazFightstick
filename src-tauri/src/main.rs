#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;
use tauri::Manager;
use std::path::Path;
use std::fs;

#[tauri::command]
fn detect_rp2040_drive() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        for letter in b'A'..=b'Z' {
            let drive = format!("{}:\\", letter as char);
            let info = format!("{}INFO_UF2.TXT", drive);
            if Path::new(&info).exists() {
                return Ok(drive);
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(entries) = fs::read_dir("/Volumes") {
            for entry in entries.flatten() {
                let p = entry.path();
                if p.join("INFO_UF2.TXT").exists() {
                    return Ok(p.to_string_lossy().to_string());
                }
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        let bases = vec!["/media", "/run/media"];
        for base in bases {
            if let Ok(entries) = fs::read_dir(base) {
                for entry in entries.flatten() {
                    let p = entry.path();
                    if p.join("INFO_UF2.TXT").exists() {
                        return Ok(p.to_string_lossy().to_string());
                    }
                }
            }
        }
    }

    Err("No RP2040 drive found".into())
}

#[tauri::command]
async fn fetch_latest_firmware() -> Result<serde_json::Value, String> {
    let url = "https://api.github.com/repos/OpenStickCommunity/GP2040-CE/releases/latest";
    let client = reqwest::Client::new();
    let res = client.get(url)
        .header("User-Agent", "cazfightstick")
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let json = res.json::<serde_json::Value>().await.map_err(|e| e.to_string())?;
    Ok(json)
}

#[tauri::command]
async fn fetch_gp2040_config(ip: String) -> Result<String, String> {
    let url = format!("http://{}/api/config", ip);
    let res = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let txt = res.text().await.map_err(|e| e.to_string())?;
    Ok(txt)
}

#[tauri::command]
async fn save_gp2040_config(ip: String, config_json: String) -> Result<String, String> {
    let url = format!("http://{}/api/save", ip);
    let client = reqwest::Client::new();
    let res = client.post(&url)
        .header("Content-Type", "application/json")
        .body(config_json)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    if res.status().is_success() {
        Ok("Saved".into())
    } else {
        Err(format!("Device returned {}", res.status()))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            detect_rp2040_drive,
            fetch_latest_firmware,
            fetch_gp2040_config,
            save_gp2040_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
