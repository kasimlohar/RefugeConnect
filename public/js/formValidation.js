export function validateForm(fields) {
    for (const field of fields) {
        if (!field.value.trim()) {
            alert(`${field.name} is required.`);
            return false;
        }
    }
    return true;
}
