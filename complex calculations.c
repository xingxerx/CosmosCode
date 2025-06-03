#include <stdio.h>
#include <omp.h>

int main() {
    #pragma omp parallel
    printf("Parallel processing inside CosmosCode!\n");
    return 0;
}