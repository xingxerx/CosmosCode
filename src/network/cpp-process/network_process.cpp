#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <sstream>

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
    }

    void deactivate() {
        active = false;
    }

    bool sendData(NetworkNode& target, const std::string& data) {
        if (!active) {
            return false;
        }
        if (!target.active) {
            return false;
        }
        return true;
    }
};

class NetworkSimulation {
private:
    std::vector<std::shared_ptr<NetworkNode>> nodes;

public:
    NetworkSimulation() {}

    int addNode(const std::string& id, const std::string& type, const std::string& ip) {
        nodes.push_back(std::make_shared<NetworkNode>(id, type, ip));
        return nodes.size() - 1;
    }

    bool activateNode(int index) {
        if (index >= 0 && index < static_cast<int>(nodes.size())) {
            nodes[index]->activate();
            return true;
        }
        return false;
    }

    bool deactivateNode(int index) {
        if (index >= 0 && index < static_cast<int>(nodes.size())) {
            nodes[index]->deactivate();
            return true;
        }
        return false;
    }

    bool sendData(int sourceIndex, int targetIndex, const std::string& data) {
        if (sourceIndex >= 0 && sourceIndex < static_cast<int>(nodes.size()) && 
            targetIndex >= 0 && targetIndex < static_cast<int>(nodes.size())) {
            return nodes[sourceIndex]->sendData(*nodes[targetIndex], data);
        }
        return false;
    }

    std::shared_ptr<NetworkNode> getNode(int index) {
        if (index >= 0 && index < static_cast<int>(nodes.size())) {
            return nodes[index];
        }
        return nullptr;
    }
};

// Simple command parser
std::string parseCommand(const std::string& input, std::string& command, 
                         std::string& id, std::string& type, std::string& ip, 
                         int& index, int& source, int& target, std::string& data) {
    std::istringstream iss(input);
    std::string token;
    
    if (!(iss >> command)) {
        return "Invalid command";
    }
    
    if (command == "addNode") {
        if (!(iss >> id >> type >> ip)) {
            return "Invalid addNode parameters";
        }
    } else if (command == "activateNode" || command == "deactivateNode" || command == "getNodeInfo") {
        if (!(iss >> index)) {
            return "Invalid index parameter";
        }
    } else if (command == "sendData") {
        if (!(iss >> source >> target)) {
            return "Invalid source/target parameters";
        }
        
        // Get the rest of the line as data
        std::getline(iss >> std::ws, data);
    } else if (command != "exit") {
        return "Unknown command";
    }
    
    return "";
}

int main() {
    NetworkSimulation simulation;
    std::string line;
    
    while (std::getline(std::cin, line)) {
        std::string command, id, type, ip, data, error;
        int index = -1, source = -1, target = -1;
        
        error = parseCommand(line, command, id, type, ip, index, source, target, data);
        
        if (!error.empty()) {
            std::cout << "{\"error\":\"" << error << "\"}" << std::endl;
            continue;
        }
        
        if (command == "addNode") {
            int result = simulation.addNode(id, type, ip);
            std::cout << "{\"result\":" << result << "}" << std::endl;
        } 
        else if (command == "activateNode") {
            bool success = simulation.activateNode(index);
            std::cout << "{\"result\":" << (success ? "true" : "false") << "}" << std::endl;
        }
        else if (command == "deactivateNode") {
            bool success = simulation.deactivateNode(index);
            std::cout << "{\"result\":" << (success ? "true" : "false") << "}" << std::endl;
        }
        else if (command == "sendData") {
            bool success = simulation.sendData(source, target, data);
            std::cout << "{\"result\":" << (success ? "true" : "false") << "}" << std::endl;
        }
        else if (command == "getNodeInfo") {
            auto node = simulation.getNode(index);
            if (node) {
                std::cout << "{\"id\":\"" << node->id << "\",\"type\":\"" << node->type 
                          << "\",\"ip\":\"" << node->ip << "\",\"active\":" 
                          << (node->active ? "true" : "false") << "}" << std::endl;
            } else {
                std::cout << "{\"result\":{}}" << std::endl;
            }
        }
        else if (command == "exit") {
            break;
        }
    }
    
    return 0;
}
