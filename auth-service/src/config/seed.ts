import Role from "../models/Role";

export const seedRoles = async () => {
    const roles = ["admin", "user", "manager"];

    for (const role of roles) {
        await Role.findOrCreate({ where: { name: role } });
    }
    console.log("✅ Roles Seeded");
};