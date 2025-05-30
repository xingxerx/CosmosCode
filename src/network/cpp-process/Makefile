CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

TARGET = network_process
SRC = network_process.cpp

all: $(TARGET)

$(TARGET): $(SRC)
    $(CXX) $(CXXFLAGS) -o $@ $^

clean:
    rm -f $(TARGET)

.PHONY: all clean
