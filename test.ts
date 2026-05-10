import axios from 'axios';
axios.get('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://music.163.com/api/v1/playlist/detail?id=2426162777'))
  .then(r => console.log(Object.keys(r.data), r.data.playlist?.tracks?.length))
  .catch(console.error);
