import fetch from 'node-fetch';

const users = [
  { name: 'Alice Johnson', age: 28 },
  { name: 'Bob Smith', age: 34 },
  { name: 'Carol White', age: 25 },
  { name: 'David Brown', age: 31 }
];

async function addUser(userData: typeof users[0]) {
  try {
    const response = await fetch('http://localhost:4000/server/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Added user: ${userData.name}`);
    return data;
  } catch (error) {
    console.error(`Error adding user ${userData.name}:`, error);
    return null;
  }
}

async function addAllUsers() {
  for (const user of users) {
    await addUser(user);
  }
}

addAllUsers().then(() => console.log('Done adding users!'));