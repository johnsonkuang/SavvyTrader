

// further implementation of asynchronous parts of firestore queries
exports.addToCollection = async function (data, db, col) {
  const queryRef = db.collection(col);
  const result = await queryRef.add(data);
  return result;
}
exports.addToCollectionWithID = async function (data, db, col, id) {
  const queryRef = db.collection(col);
  const result = await queryRef.doc(id).set(data);
  return result;
}
exports.setUserEnergy = async function (user, newEnergy, db, col) {
  const queryRef = db.collection(col).doc(user);
  const result = await queryRef.update({energy: newEnergy});
  return result;
}
exports.setUserPoints = async function (user, newPoints, db, col) {
  const queryRef = db.collection(col).doc(user);
  const result = await queryRef.update({points: newPoints});
  return result;
}
exports.getUserInfo = async function (user, db, col) {
  const queryRef = db.collection(col).doc(user);
  const resultRef = await queryRef.get();
  if (!resultRef.exists) {
    return null;
  }
  return resultRef.data();
}
exports.getUsersPredictions = async function (user, db, col) {
  const queryRef = db.collection(col);
  const resultRef = await queryRef.where('trader', '==', user).get();
  return resultRef.docs.map(doc => doc.data());
}
exports.getLeaderBoard = async function (db, col) {
  const queryRef = db.collection(col);
  const resultRef = await queryRef.orderBy("points").limit(10).get();
  return resultRef.docs.map(doc => doc.id + ": " + doc.data().points);
}
