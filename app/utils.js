//function to help find a given state object (goal, category, user)
const findObject = (objId, state) => {
   const item = state.find(obj => obj.id === objId);
   return !item ? null : item;
 };
 
 module.exports = {
   findObject
 };
 