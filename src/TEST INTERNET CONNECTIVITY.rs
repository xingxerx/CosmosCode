use std::process::Command;
fn main() {
    let output = Command::new("ping")
        .arg("-c")
        .arg("1")
        .arg("google.com")
        .output()
        .expect("Failed to ping Google");
    println!("Ping output: {}", String::from_utf8_lossy(&output.stdout));
}

Output:
