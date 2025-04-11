const parseObject = <T extends object>(
  jsonString: string,
  object: T,
  keys: Array<keyof T>,
) => {
  const parsedObject = JSON.parse(jsonString);
  for (const key of keys) {
    if (parsedObject[key] != undefined) {
      object[key] = parsedObject[key];
    }
  }
};

export default parseObject;
