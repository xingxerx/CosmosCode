#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <memory>

// Simple class to represent a network node
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
        std::cout << "Node " << id << " activated" << std::endl;
    }

    void deactivate() {
        active = false;
        std::cout << "Node " << id << " deactivated" << std::endl;
    }

    bool sendData(NetworkNode& target, const std::string& data) {
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
};

// Very simple JSON parser for our specific format
std::vector<NetworkNode> parseNodes(const std::string& json) {
    std::vector<NetworkNode> nodes;
    
    // Find the nodes array
    size_t nodesStart = json.find("\"nodes\"");
    if (nodesStart == std::string::npos) return nodes;
    
    size_t arrayStart = json.find('[', nodesStart);
    size_t arrayEnd = json.find(']', arrayStart);
    
    std::string nodesJson = json.substr(arrayStart + 1, arrayEnd - arrayStart - 1);
    
    // Split by objects
    size_t pos = 0;
    while (pos < nodesJson.length()) {
        size_t objStart = nodesJson.find('{', pos);
        if (objStart == std::string::npos) break;
        
        size_t objEnd = nodesJson.find('}', objStart);
        if (objEnd == std::string::npos) break;
        
        std::string nodeJson = nodesJson.substr(objStart, objEnd - objStart + 1);
        
        // Extract id, type, and ip
        std::string id, type, ip;
        
        size_t idPos = nodeJson.find("\"id\"");
        if (idPos != std::string::npos) {
            size_t valueStart = nodeJson.find(':', idPos) + 1;
            size_t valueEnd = nodeJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = nodeJson.find('}', valueStart);
            
            id = nodeJson.substr(valueStart, valueEnd - valueStart);
            // Remove quotes and whitespace
            id = id.substr(id.find('"') + 1);
            id = id.substr(0, id.find('"'));
        }
        
        size_t typePos = nodeJson.find("\"type\"");
        if (typePos != std::string::npos) {
            size_t valueStart = nodeJson.find(':', typePos) + 1;
            size_t valueEnd = nodeJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = nodeJson.find('}', valueStart);
            
            type = nodeJson.substr(valueStart, valueEnd - valueStart);
            // Remove quotes and whitespace
            type = type.substr(type.find('"') + 1);
            type = type.substr(0, type.find('"'));
        }
        
        size_t ipPos = nodeJson.find("\"ip\"");
        if (ipPos != std::string::npos) {
            size_t valueStart = nodeJson.find(':', ipPos) + 1;
            size_t valueEnd = nodeJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = nodeJson.find('}', valueStart);
            
            ip = nodeJson.substr(valueStart, valueEnd - valueStart);
            // Remove quotes and whitespace
            ip = ip.substr(ip.find('"') + 1);
            ip = ip.substr(0, ip.find('"'));
        }
        
        if (!id.empty() && !type.empty() && !ip.empty()) {
            nodes.emplace_back(id, type, ip);
        }
        
        pos = objEnd + 1;
    }
    
    return nodes;
}

// Process actions from JSON
void processActions(const std::string& json, std::vector<NetworkNode>& nodes, std::vector<std::string>& results) {
    // Find the actions array
    size_t actionsStart = json.find("\"actions\"");
    if (actionsStart == std::string::npos) return;
    
    size_t arrayStart = json.find('[', actionsStart);
    size_t arrayEnd = json.find(']', arrayStart);
    
    std::string actionsJson = json.substr(arrayStart + 1, arrayEnd - arrayStart - 1);
    
    // Split by objects
    size_t pos = 0;
    while (pos < actionsJson.length()) {
        size_t objStart = actionsJson.find('{', pos);
        if (objStart == std::string::npos) break;
        
        size_t objEnd = actionsJson.find('}', objStart);
        if (objEnd == std::string::npos) break;
        
        std::string actionJson = actionsJson.substr(objStart, objEnd - objStart + 1);
        
        // Extract type and parameters
        std::string type;
        int nodeIndex = -1, sourceIndex = -1, targetIndex = -1;
        std::string data;
        
        size_t typePos = actionJson.find("\"type\"");
        if (typePos != std::string::npos) {
            size_t valueStart = actionJson.find(':', typePos) + 1;
            size_t valueEnd = actionJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = actionJson.find('}', valueStart);
            
            type = actionJson.substr(valueStart, valueEnd - valueStart);
            // Remove quotes and whitespace
            type = type.substr(type.find('"') + 1);
            type = type.substr(0, type.find('"'));
        }
        
        size_t nodeIndexPos = actionJson.find("\"nodeIndex\"");
        if (nodeIndexPos != std::string::npos) {
            size_t valueStart = actionJson.find(':', nodeIndexPos) + 1;
            size_t valueEnd = actionJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = actionJson.find('}', valueStart);
            
            std::string indexStr = actionJson.substr(valueStart, valueEnd - valueStart);
            // Remove whitespace
            while (indexStr[0] == ' ' || indexStr[0] == '\t') indexStr = indexStr.substr(1);
            nodeIndex = std::stoi(indexStr);
        }
        
        size_t sourceIndexPos = actionJson.find("\"sourceIndex\"");
        if (sourceIndexPos != std::string::npos) {
            size_t valueStart = actionJson.find(':', sourceIndexPos) + 1;
            size_t valueEnd = actionJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = actionJson.find('}', valueStart);
            
            std::string indexStr = actionJson.substr(valueStart, valueEnd - valueStart);
            // Remove whitespace
            while (indexStr[0] == ' ' || indexStr[0] == '\t') indexStr = indexStr.substr(1);
            sourceIndex = std::stoi(indexStr);
        }
        
        size_t targetIndexPos = actionJson.find("\"targetIndex\"");
        if (targetIndexPos != std::string::npos) {
            size_t valueStart = actionJson.find(':', targetIndexPos) + 1;
            size_t valueEnd = actionJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = actionJson.find('}', valueStart);
            
            std::string indexStr = actionJson.substr(valueStart, valueEnd - valueStart);
            // Remove whitespace
            while (indexStr[0] == ' ' || indexStr[0] == '\t') indexStr = indexStr.substr(1);
            targetIndex = std::stoi(indexStr);
        }
        
        size_t dataPos = actionJson.find("\"data\"");
        if (dataPos != std::string::npos) {
            size_t valueStart = actionJson.find(':', dataPos) + 1;
            size_t valueEnd = actionJson.find(',', valueStart);
            if (valueEnd == std::string::npos) valueEnd = actionJson.find('}', valueStart);
            
            data = actionJson.substr(valueStart, valueEnd - valueStart);
            // Remove quotes and whitespace
            data = data.substr(data.find('"') + 1);
            data = data.substr(0, data.find('"'));
        }
        
        // Process the action
        std::string result = "{\"type\":\"" + type + "\",";
        
        if (type == "activate") {
            if (nodeIndex >= 0 && nodeIndex < static_cast<int>(nodes.size())) {
                nodes[nodeIndex].activate();
                result += "\"nodeIndex\":" + std::to_string(nodeIndex) + ",\"success\":true}";
            } else {
                result += "\"nodeIndex\":" + std::to_string(nodeIndex) + ",\"success\":false}";
            }
        } 
        else if (type == "deactivate") {
            if (nodeIndex >= 0 && nodeIndex < static_cast<int>(nodes.size())) {
                nodes[nodeIndex].deactivate();
                result += "\"nodeIndex\":" + std::to_string(nodeIndex) + ",\"success\":true}";
            } else {
                result += "\"nodeIndex\":" + std::to_string(nodeIndex) + ",\"success\":false}";
            }
        }
        else if (type == "sendData") {
            if (sourceIndex >= 0 && sourceIndex < static_cast<int>(nodes.size()) && 
                targetIndex >= 0 && targetIndex < static_cast<int>(nodes.size())) {
                bool success = nodes[sourceIndex].sendData(nodes[targetIndex], data);
                result += "\"sourceIndex\":" + std::to_string(sourceIndex) + 
                         ",\"targetIndex\":" + std::to_string(targetIndex) + 
                         ",\"data\":\"" + data + "\",\"success\":" + (success ? "true" : "false") + "}";
            } else {
                result += "\"sourceIndex\":" + std::to_string(sourceIndex) + 
                         ",\"targetIndex\":" + std::to_string(targetIndex) + 
                         ",\"data\":\"" + data + "\",\"success\":false}";
            }
        }
        
        results.push_back(result);
        pos = objEnd + 1;
    }
}

// Generate JSON output
std::string generateOutput(const std::vector<NetworkNode>& nodes, const std::vector<std::string>& actionResults) {
    std::string output = "{\"nodes\":[";
    
    for (size_t i = 0; i < nodes.size(); ++i) {
        const auto& node = nodes[i];
        output += "{\"id\":\"" + node.id + "\",\"type\":\"" + node.type + 
                 "\",\"ip\":\"" + node.ip + "\",\"active\":" + (node.active ? "true" : "false") + "}";
        if (i < nodes.size() - 1) output += ",";
    }
    
    output += "],\"actions\":[";
    
    for (size_t i = 0; i < actionResults.size(); ++i) {
        output += actionResults[i];
        if (i < actionResults.size() - 1) output += ",";
    }
    
    output += "]}";
    return output;
}

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
        if (!input.is_open()) {
            std::cerr << "Failed to open input file: " << inputFile << std::endl;
            return 1;
        }
        
        std::string json((std::istreambuf_iterator<char>(input)), std::istreambuf_iterator<char>());
        input.close();
        
        // Parse nodes
        std::vector<NetworkNode> nodes = parseNodes(json);
        std::cout << "Parsed " << nodes.size() << " nodes" << std::endl;
        
        // Process actions
        std::vector<std::string> actionResults;
        processActions(json, nodes, actionResults);
        std::cout << "Processed " << actionResults.size() << " actions" << std::endl;
        
        // Generate output
        std::string output = generateOutput(nodes, actionResults);
        
        // Write output
        std::ofstream outFile(outputFile);
        if (!outFile.is_open()) {
            std::cerr << "Failed to open output file: " << outputFile << std::endl;
            return 1;
        }
        
        outFile << output;
        outFile.close();
        
        std::cout << "Simulation completed successfully" << std::endl;
        return 0;
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}
