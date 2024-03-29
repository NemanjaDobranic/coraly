import { useCallback, useEffect, useState } from "react";

export default function useLocalStorage<Type>(
  key: string,
  initialValue?: Type
) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (val: React.Dispatch<React.SetStateAction<Type>>) => {
      const valueToStore = val instanceof Function ? val(value) : val;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    },
    [value, key]
  );

  useEffect(() => {
    setStoredValue(value);
  }, [value, setStoredValue]);

  return [value, setStoredValue];
}
