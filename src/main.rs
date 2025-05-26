use rand::Rng;
use chrono::Local;

fn main() {
    // Get current time
    let current_time = Local::now();
    println!("Current time: {}", current_time.format("%Y-%m-%d %H:%M:%S"));
    
    // Generate a random number
    let random_number = rand::thread_rng().gen_range(1..=100);
    println!("Random number between 1 and 100: {}", random_number);
}
