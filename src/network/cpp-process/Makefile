CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra
LDFLAGS = -lnlohmann_json

TARGET = network_process
SRC = network_process.cpp

all: $(TARGET)

$(TARGET): $(SRC)
    $(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

clean:
    rm -f $(TARGET)

.PHONY: all clean