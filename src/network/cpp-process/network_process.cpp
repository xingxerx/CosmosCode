#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

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

    json getNodeInfo(int index) {
        json result;
        if (index >= 0 && index < static_cast<int>(nodes.size())) {
            result["id"] = nodes[index]->id;
            result["type"] = nodes[index]->type;
            result["ip"] = nodes[index]->ip;
            result["active"] = nodes[index]->active;
        }
        return result;
    }
};

int main() {
    NetworkSimulation simulation;
    std::string line;
    
    while (std::getline(std::cin, line)) {
        try {
            json input = json::parse(line);
            json response;
            
            std::string command = input["command"];
            
            if (command == "addNode") {
                int index = simulation.addNode(
                    input["id"], input["type"], input["ip"]);
                response["result"] = index;
            } 
            else if (command == "activateNode") {
                bool success = simulation.activateNode(input["index"]);
                response["result"] = success;
            }
            else if (command == "deactivateNode") {
                bool success = simulation.deactivateNode(input["index"]);
                response["result"] = success;
            }
            else if (command == "sendData") {
                bool success = simulation.sendData(
                    input["source"], input["target"], input["data"]);
                response["result"] = success;
            }
            else if (command == "getNodeInfo") {
                response["result"] = simulation.getNodeInfo(input["index"]);
            }
            else if (command == "exit") {
                break;
            }
            
            std::cout << response.dump() << std::endl;
        } catch (const std::exception& e) {
            json error;
            error["error"] = e.what();
            std::cout << error.dump() << std::endl;
        }
    }
    
    return 0;
}