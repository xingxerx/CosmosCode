#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <sstream>

// Simple JSON implementation without external dependencies
class SimpleJson {
public:
    std::string toString() const {
        return jsonStr;
    }

    void addProperty(const std::string& key, const std::string& value) {
        if (!jsonStr.empty() && jsonStr != "{") {
            jsonStr += ",";
        }
        jsonStr += "\"" + key + "\":\"" + value + "\"";
    }

    void addProperty(const std::string& key, int value) {
        if (!jsonStr.empty() && jsonStr != "{") {
            jsonStr += ",";
        }
        jsonStr += "\"" + key + "\":" + std::to_string(value);
    }

    void addProperty(const std::string& key, bool value) {
        if (!jsonStr.empty() && jsonStr != "{") {
            jsonStr += ",";
        }
        jsonStr += "\"" + key + "\":" + (value ? "true" : "false");
    }

    void startObject() {
        jsonStr = "{";
    }

    void endObject() {
        jsonStr += "}";
    }

private:
    std::string jsonStr;
};

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

    std::string toJson() {
        SimpleJson json;
        json.startObject();
        json.addProperty("id", id);
        json.addProperty("type", type);
        json.addProperty("ip", ip);
        json.addProperty("active", active);
        json.endObject();
        return json.toString();
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

    std::string getNodeInfo(int index) {
        if (index >= 0 && index < static_cast<int>(nodes.size())) {
            return nodes[index]->toJson();
        }
        SimpleJson json;
        json.startObject();
        json.endObject();
        return json.toString();
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
            SimpleJson response;
            response.startObject();
            response.addProperty("error", error);
            response.endObject();
            std::cout << response.toString() << std::endl;
            continue;
        }
        
        SimpleJson response;
        response.startObject();
        
        if (command == "addNode") {
            int result = simulation.addNode(id, type, ip);
            response.addProperty("result", result);
        } 
        else if (command == "activateNode") {
            bool success = simulation.activateNode(index);
            response.addProperty("result", success);
        }
        else if (command == "deactivateNode") {
            bool success = simulation.deactivateNode(index);
            response.addProperty("result", success);
        }
        else if (command == "sendData") {
            bool success = simulation.sendData(source, target, data);
            response.addProperty("result", success);
        }
        else if (command == "getNodeInfo") {
            std::string nodeInfo = simulation.getNodeInfo(index);
            response.addProperty("result", nodeInfo);
        }
        else if (command == "exit") {
            break;
        }
        
        response.endObject();
        std::cout << response.toString() << std::endl;
    }
    
    return 0;
}
