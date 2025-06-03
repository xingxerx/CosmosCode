#include <stdio.h>

int main() {
    char name[50]; // Declare a character array to store the name

    printf("Enter your name: ");
    scanf("%49s", name); // Read input from the user, %49s to prevent buffer overflow

    printf("Hello, %s, from C!\n", name); // Print the personalized greeting
    return 0;
}