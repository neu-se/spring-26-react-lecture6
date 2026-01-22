/* eslint no-console: "off" */

import { app } from './app.ts';

const PORT = parseInt(process.env.PORT || '8000');
app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});
