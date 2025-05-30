#include <iostream>
#include <vector>
#include <string>

// Simple network node representation
class NetworkNode {
public:
    std::string id;
    std::string type;
    std::string ip;
    bool active;

    NetworkNode(std::string id, std::string type, std::string ip)
        : id(id), type(type), ip(ip), active(false) {}

    void activate() {
        active = true;
        std::cout << "Node " << id << " (" << ip << ") activated" << std::endl;
    }

    void deactivate() {
        active = false;
        std::cout << "Node " << id << " (" << ip << ") deactivated" << std::endl;
    }

    void sendData(const NetworkNode& target, const std::string& data) {
        if (!active) {
            std::cout << "Error: Source node " << id << " is not active" << std::endl;
            return;
        }
        if (!target.active) {
            std::cout << "Error: Target node " << target.id << " is not active" << std::endl;
            return;
        }
        std::cout << "Data sent from " << id << " to " << target.id << ": " << data << std::endl;
    }
};

int main() {
    std::cout << "Network Simulation in C++" << std::endl;
    std::cout << "-------------------------" << std::endl;

    // Create network nodes
    std::vector<NetworkNode> nodes = {
        NetworkNode("server-1", "server", "192.168.1.1"),
        NetworkNode("router-1", "router", "192.168.1.254"),
        NetworkNode("client-1", "client", "192.168.1.100"),
        NetworkNode("client-2", "client", "192.168.1.101")
    };

    // Activate nodes
    for (auto& node : nodes) {
        node.activate();
    }

    std::cout << "\nSimulating network traffic:" << std::endl;
    
    // Simulate some network traffic
    nodes[2].sendData(nodes[0], "GET /api/data");
    nodes[0].sendData(nodes[2], "200 OK: {\"data\": [1, 2, 3]}");
    nodes[3].sendData(nodes[0], "POST /api/update");
    nodes[0].sendData(nodes[3], "201 Created");

    // Deactivate a node and try to send data
    nodes[0].deactivate();
    nodes[2].sendData(nodes[0], "GET /api/status");

    std::cout << "\nNetwork simulation completed" << std::endl;
    return 0;
}
