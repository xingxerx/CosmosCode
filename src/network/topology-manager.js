/**
 * Network Topology Manager for Simulated Internet
 */

class TopologyManager {
  constructor(internet) {
    this.internet = internet;
  }

  // Create a star topology with one central node and multiple leaf nodes
  createStarTopology(centerNodeId, leafCount, options = {}) {
    const centerNode = this.internet.nodes.get(centerNodeId) || 
                      this.internet.createNode(centerNodeId, options.centerType || 'router');
    
    const leafNodes = [];
    for (let i = 0; i < leafCount; i++) {
      const leafId = `${options.leafPrefix || 'node'}-${i + 1}`;
      const leafNode = this.internet.createNode(leafId, options.leafType || 'client');
      this.internet.connect(centerNodeId, leafId);
      leafNodes.push(leafNode);
    }
    
    return {
      center: centerNode,
      leaves: leafNodes
    };
  }

  // Create a mesh topology where each node connects to every other node
  createMeshTopology(nodeCount, options = {}) {
    const nodes = [];
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const nodeId = `${options.nodePrefix || 'mesh-node'}-${i + 1}`;
      const node = this.internet.createNode(nodeId, options.nodeType || 'peer');
      nodes.push(node);
    }
    
    // Connect each node to every other node
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        this.internet.connect(nodes[i].id, nodes[j].id);
      }
    }
    
    return nodes;
  }

  // Create a ring topology where each node connects to its neighbors
  createRingTopology(nodeCount, options = {}) {
    const nodes = [];
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const nodeId = `${options.nodePrefix || 'ring-node'}-${i + 1}`;
      const node = this.internet.createNode(nodeId, options.nodeType || 'peer');
      nodes.push(node);
    }
    
    // Connect nodes in a ring
    for (let i = 0; i < nodes.length; i++) {
      const nextIndex = (i + 1) % nodes.length;
      this.internet.connect(nodes[i].id, nodes[nextIndex].id);
    }
    
    return nodes;
  }

  /**
   * Create a tree topology with specified depth and branching factor.
   * The full tree structure is created within the internet simulation.
   * @param {string} rootId - The ID for the root node. If the node doesn't exist, it will be created.
   * @param {number} depth - The depth of the tree (e.g., depth 0 is just the root, depth 1 is root and its direct children).
   * @param {number} branchingFactor - The number of children each non-leaf node will have.
   * @param {object} [options={}] - Optional parameters.
   * @param {string} [options.rootType='router'] - The type of the root node.
   * @param {string} [options.leafType='client'] - The type of the leaf nodes (nodes at the maximum depth).
   * @param {string} [options.nodeType='router'] - The type of intermediate (non-root, non-leaf) nodes.
   * @returns {{root: object, children: object[]}} An object containing the root node and an array of its direct children.
   */
  createTreeTopology(rootId, depth, branchingFactor, options = {}) {
    const rootNode = this.internet.nodes.get(rootId) || 
                    this.internet.createNode(rootId, options.rootType || 'router');
    
    const createChildren = (parentId, currentDepth) => {
      if (currentDepth >= depth) {
        return [];
      }
      
      const children = [];
      for (let i = 0; i < branchingFactor; i++) {
        const childId = `${parentId}-${i + 1}`;
        const childType = currentDepth === depth - 1 ? 
                         (options.leafType || 'client') : 
                         (options.nodeType || 'router');
        
        const childNode = this.internet.createNode(childId, childType);
        this.internet.connect(parentId, childId);
        children.push(childNode);
        
        createChildren(childId, currentDepth + 1); // Recursively create children
      }
      
      return children;
    };
    
    const children = createChildren(rootId, 0);
    return {
      root: rootNode,
      children
    };
  }
}

module.exports = TopologyManager;