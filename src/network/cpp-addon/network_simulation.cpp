#include <napi.h>
#include <string>
#include <vector>
#include <memory>
#include <stdexcept>

// Error handling helper
class NetworkError : public std::runtime_error {
public:
    NetworkError(const std::string& message) : std::runtime_error(message) {}
};

// Improved NetworkNode class
class NetworkNode {
public:
    std::string id;
    std::string type;
    std::string ip;
    bool active;
    std::vector<std::string> connections;

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
            throw NetworkError("Source node is not active");
        }
        if (!target.active) {
            throw NetworkError("Target node is not active");
        }
        
        // Check if nodes are connected
        bool connected = false;
        for (const auto& conn : connections) {
            if (conn == target.id) {
                connected = true;
                break;
            }
        }
        
        if (!connected) {
            throw NetworkError("Nodes are not connected");
        }
        
        return true;
    }
    
    void addConnection(const std::string& targetId) {
        connections.push_back(targetId);
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
        if (index >= 0 && index < nodes.size()) {
            nodes[index]->activate();
            return true;
        }
        return false;
    }

    bool deactivateNode(int index) {
        if (index >= 0 && index < nodes.size()) {
            nodes[index]->deactivate();
            return true;
        }
        return false;
    }

    bool sendData(int sourceIndex, int targetIndex, const std::string& data) {
        if (sourceIndex >= 0 && sourceIndex < nodes.size() && 
            targetIndex >= 0 && targetIndex < nodes.size()) {
            return nodes[sourceIndex]->sendData(*nodes[targetIndex], data);
        }
        return false;
    }

    Napi::Object getNodeInfo(int index, Napi::Env env) {
        Napi::Object result = Napi::Object::New(env);
        
        if (index >= 0 && index < nodes.size()) {
            result.Set("id", nodes[index]->id);
            result.Set("type", nodes[index]->type);
            result.Set("ip", nodes[index]->ip);
            result.Set("active", nodes[index]->active);
        }
        
        return result;
    }
};

// Wrapper class for NetworkSimulation
class NetworkSimulationWrapper : public Napi::ObjectWrap<NetworkSimulationWrapper> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    NetworkSimulationWrapper(const Napi::CallbackInfo& info);

private:
    static Napi::FunctionReference constructor;
    NetworkSimulation simulation;

    Napi::Value AddNode(const Napi::CallbackInfo& info);
    Napi::Value ActivateNode(const Napi::CallbackInfo& info);
    Napi::Value DeactivateNode(const Napi::CallbackInfo& info);
    Napi::Value SendData(const Napi::CallbackInfo& info);
    Napi::Value GetNodeInfo(const Napi::CallbackInfo& info);
};

Napi::FunctionReference NetworkSimulationWrapper::constructor;

Napi::Object NetworkSimulationWrapper::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "NetworkSimulation", {
        InstanceMethod("addNode", &NetworkSimulationWrapper::AddNode),
        InstanceMethod("activateNode", &NetworkSimulationWrapper::ActivateNode),
        InstanceMethod("deactivateNode", &NetworkSimulationWrapper::DeactivateNode),
        InstanceMethod("sendData", &NetworkSimulationWrapper::SendData),
        InstanceMethod("getNodeInfo", &NetworkSimulationWrapper::GetNodeInfo)
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("NetworkSimulation", func);
    return exports;
}

NetworkSimulationWrapper::NetworkSimulationWrapper(const Napi::CallbackInfo& info) 
    : Napi::ObjectWrap<NetworkSimulationWrapper>(info) {
    Napi::Env env = info.Env();
    Napi::HandleScope scope(env);
}

Napi::Value NetworkSimulationWrapper::AddNode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 3) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string id = info[0].As<Napi::String>();
    std::string type = info[1].As<Napi::String>();
    std::string ip = info[2].As<Napi::String>();

    int index = simulation.addNode(id, type, ip);
    return Napi::Number::New(env, index);
}

Napi::Value NetworkSimulationWrapper::ActivateNode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int index = info[0].As<Napi::Number>().Int32Value();
    bool success = simulation.activateNode(index);
    
    return Napi::Boolean::New(env, success);
}

Napi::Value NetworkSimulationWrapper::DeactivateNode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int index = info[0].As<Napi::Number>().Int32Value();
    bool success = simulation.deactivateNode(index);
    
    return Napi::Boolean::New(env, success);
}

Napi::Value NetworkSimulationWrapper::SendData(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 3) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int sourceIndex = info[0].As<Napi::Number>().Int32Value();
    int targetIndex = info[1].As<Napi::Number>().Int32Value();
    std::string data = info[2].As<Napi::String>();

    bool success = simulation.sendData(sourceIndex, targetIndex, data);
    
    return Napi::Boolean::New(env, success);
}

Napi::Value NetworkSimulationWrapper::GetNodeInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int index = info[0].As<Napi::Number>().Int32Value();
    return simulation.getNodeInfo(index, env);
}

// Initialize native addon
Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return NetworkSimulationWrapper::Init(env, exports);
}

NODE_API_MODULE(network_simulation, InitAll)
