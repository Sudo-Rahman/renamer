export interface User {
    _id: {
        $oid: string
    },
    email: string,
    key: string,
    machine_id: string,
}