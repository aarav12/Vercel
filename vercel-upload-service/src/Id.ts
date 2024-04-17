export function generate() {
    const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
    const lenght = 5;
    let id = "";
    for (let i = 0; i < lenght; i++){
        const index = Math.floor(Math.random() * subset.length);
        id+=subset[index];
    }
    return id;
}