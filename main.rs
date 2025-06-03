use std::fs;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct WireGuardConfig {
    Interface: InterfaceConfig,
    Peer: Vec<PeerConfig>,
}

#[derive(Debug, Deserialize)]
struct InterfaceConfig {
    Address: String,
    PrivateKey: String,
}

#[derive(Debug, Deserialize)]
struct PeerConfig {
    PublicKey: String,
    Endpoint: String,
}

fn main() {
    let config_content = fs::read_to_string("wg0.conf").expect("Failed to read file");
    let config: WireGuardConfig = toml::from_str(&config_content).expect("Failed to parse");
    println!("{:?}", config);
}

// ... (previous code) ...
        }
    }
}
#[derive(Debug, Deserialize)] // This is line 94
struct WireGuardConfig {      // This is line 95 - the duplicate!
    #[serde(rename = "Interface")]
    interface: InterfaceConfig,
    #[serde(rename = "Peer")]
    peer: Vec<PeerConfig>, // This expects a list/array of peers
}

use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Serialize;

#[derive(Serialize)]
struct Message {
    message: String,
}

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::Ok().json(Message {
        message: "Hello from Rust API!".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://127.0.0.1:8080");
    HttpServer::new(|| {
        App::new()
            .service(index)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}