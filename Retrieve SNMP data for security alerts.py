from pysnmp.hlapi import *

def get_snmp_data(target, oid):
    return next(
        getCmd(SnmpEngine(),
               CommunityData('public'),
               UdpTransportTarget((target, 161)),
               ContextData(),
               ObjectType(ObjectIdentity(oid)))
    )

print(get_snmp_data("192.168.1.1", "1.3.6.1.2.1.1.1.0"))