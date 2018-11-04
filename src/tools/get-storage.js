export default function getStorage(storageKey, defaultValue) {
    function getter() {
        let value;
        defaultValue = JSON.parse(JSON.stringify(defaultValue));
        try {
            value = localStorage.getItem(storageKey);
            value = JSON.parse(value);
            if (value) {
                value = Object.assign(value);
            }
            return value || defaultValue;
        } catch (error) {
            return defaultValue;
        }
    }

    function setter(value) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(value));
        } catch (error) {
            return false;
        }
    }
    return {
        getter,
        setter
    }
}
