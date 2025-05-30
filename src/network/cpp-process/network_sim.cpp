#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

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

    bool sendData(const NetworkNode& target, const std::string& data) {
        if (!active) {
            std::cout << "Error: Source node " << id << " is not active" << std::endl;
            return false;
        }
        if (!target.active) {
            std::cout << "Error: Target node " << target.id << " is not active" << std::endl;
            return false;
        }
        std::cout << "Data sent from " << id << " to " << target.id << ": " << data << std::endl;
        return true;
    }

    json toJson() const {
        json j;
        j["id"] = id;
        j["type"] = type;
        j["ip"] = ip;
        j["active"] = active;
        return j;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <input_file> <output_file>" << std::endl;
        return 1;
    }

    std::string inputFile = argv[1];
    std::string outputFile = argv[2];

    try {
        // Read input configuration
        std::ifstream input(inputFile);
        json config;
        input >> config;
        input.close();

        // Create network nodes
        std::vector<NetworkNode> nodes;
        for (const auto& nodeConfig : config["nodes"]) {
            nodes.emplace_back(
                nodeConfig["id"].get<std::string>(),
                nodeConfig["type"].get<std::string>(),
                nodeConfig["ip"].get<std::string>()
            );
        }

        // Activate nodes
        for (auto& node : nodes) {
            if (node.id.find("server") != std::string::npos || 
                node.id.find("router") != std::string::npos) {
                node.activate();
            }
        }

        // Process actions
        json results;
        results["nodes"] = json::array();
        results["actions"] = json::array();

        for (const auto& action : config["actions"]) {
            std::string type = action["type"].get<std::string>();
            
            if (type == "activate") {
                int nodeIndex = action["nodeIndex"].get<int>();
                if (nodeIndex >= 0 && nodeIndex < nodes.size()) {
                    nodes[nodeIndex].activate();
                    results["actions"].push_back({
                        {"type", "activate"},
                        {"nodeIndex", nodeIndex},
                        {"success", true}
                    });
                }
            }
            else if (type == "deactivate") {
                int nodeIndex = action["nodeIndex"].get<int>();
                if (nodeIndex >= 0 && nodeIndex < nodes.size()) {
                    nodes[nodeIndex].deactivate();
                    results["actions"].push_back({
                        {"type", "deactivate"},
                        {"nodeIndex", nodeIndex},
                        {"success", true}
                    });
                }
            }
            else if (type == "sendData") {
                int sourceIndex = action["sourceIndex"].get<int>();
                int targetIndex = action["targetIndex"].get<int>();
                std::string data = action["data"].get<std::string>();
                
                bool success = false;
                if (sourceIndex >= 0 && sourceIndex < nodes.size() && 
                    targetIndex >= 0 && targetIndex < nodes.size()) {
                    success = nodes[sourceIndex].sendData(nodes[targetIndex], data);
                }
                
                results["actions"].push_back({
                    {"type", "sendData"},
                    {"sourceIndex", sourceIndex},
                    {"targetIndex", targetIndex},
                    {"data", data},
                    {"success", success}
                });
            }
        }

        // Add final node states to results
        for (const auto& node : nodes) {
            results["nodes"].push_back(node.toJson());
        }

        // Write results to output file
        std::ofstream output(outputFile);
        output << results.dump(2);
        output.close();

        return 0;
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}