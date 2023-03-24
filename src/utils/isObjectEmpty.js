const isObjectEmpty = (myObject) => {
  return (
    myObject &&
    Object.keys(myObject).length === 0 &&
    myObject.constructor === Object
  );
};

module.exports = { isObjectEmpty };
