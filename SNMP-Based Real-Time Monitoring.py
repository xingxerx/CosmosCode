from pysnmp.hlapi import *

def get_snmp_data(ip, community, oid):
    iterator = getCmd(SnmpEngine(),
                      CommunityData(community, mpModel=0),
                      UdpTransportTarget((ip, 161)),
                      ContextData(),
                      ObjectType(ObjectIdentity(oid)))

    for errorIndication, errorStatus, errorIndex, varBinds in iterator:
        if errorIndication or errorStatus:
            return f"Error: {errorIndication or errorStatus}"
        return f"Value: {varBinds[0][1]}"

print(get_snmp_data("192.168.1.1", "public", "1.3.6.1.2.1.2.2.1.10.1"))