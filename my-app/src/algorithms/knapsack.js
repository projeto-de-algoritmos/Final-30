export function knapSack(items, W) {
    let cache = [];
    for (let g = 0; g < items.length+1; g++){
         cache[g] = [];
         for (let h = 0; h < W+1; h++) {
              cache[g][h] = 0;
         }
    }
    const weights = items.map(item => item.weight);
    const values = items.map(item => item.value);
    
    for (let i = 0; i < items.length+1; i++) {
         for (let j = 0; j < W+1; j++) {
              if (i === 0 || j === 0)
                   cache[i][j] = 0;
              else if (weights[i-1] <= j) {
                   let included = values[i-1] + cache[i-1][j-weights[i-1]];
                   let excluded = cache[i-1][j];                   
                   cache[i][j] = Math.max(included, excluded);
              }
              else
                   cache[i][j] = cache[i-1][j]
         }
    }
    return cache[items.length][W];
}

export const unboundedKnapsack = (items, n, target) => { 

    const lookup = new Array(target + 1).fill(0);

    for(let i = 0; i <= target; i++){
      for(let j = 0; j < n; j++){
        if(items[j].weight <= i){
          lookup[i] = Math.max(lookup[i], lookup[i - items[j].weight] + items[j].value);
        }
      }
    }
    
    return lookup[target];
}

function max(a, b) {
    return (a > b) ? a : b
}
  
export function knapSackRecursive(capacidadeTotal, items, itemsSize, bagItems = []) {  
    if (itemsSize === 0 || capacidadeTotal === 0) return [0,bagItems];
  
    if (items[itemsSize - 1].weight > capacidadeTotal) return knapSackRecursive(capacidadeTotal, items, itemsSize - 1, bagItems)

    const use = knapSackRecursive(capacidadeTotal - items[itemsSize - 1].weight, items, itemsSize - 1, bagItems);
    const notUse = knapSackRecursive(capacidadeTotal, items, itemsSize - 1, bagItems);
    return (items[itemsSize - 1].value + use[0]) > notUse[0] ? [items[itemsSize - 1].value + use[0],[...use[1], items[itemsSize - 1]]] : notUse;
}