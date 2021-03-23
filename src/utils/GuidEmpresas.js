export default function Guids () {
    return new Promise(resolve => {
        var cliente = window.location.href
        var guid = 0
        if (cliente.includes('desenvolvimento')) {
            guid = '6CF79041-6785-49BE-8F24-4AABD55AD654'
        } else if (cliente.includes('brucebarber')) {
            guid = '93b7fdb8-20f0-4a72-8a27-e34b3bacbd06'
        } else if (cliente.includes('winners')) {
            guid = '8A7F24E6-41AC-49ED-B2F2-9DFE756A2EFE'
        } else if (cliente.includes('bossbarbearia')) {
            guid = '4eb8c765-a491-4363-b9ba-e37e3f2e8148'
        } else {
            guid = '6CF79041-6785-49BE-8F24-4AABD55AD654'
        }
        resolve(guid)
    })
}