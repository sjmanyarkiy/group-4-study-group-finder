const BASE_URL = process.env.REACT_APP_API_URL || "";

export default BASE_URL;
```

Then add a `.env` file in your `client/` folder:
```
REACT_APP_API_URL=https://group-4-study-group-finder.onrender.com/