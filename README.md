
  # Access Realty

  This is a code bundle for Access Realty. The original project is available at https://www.figma.com/design/jKKAx3nRqMu5EXx2dp8IBa/Access-Realty.

  ## Setup

  1. Run `npm i` to install the dependencies.

  2. Copy `.env.example` to `.env` and configure your environment variables:
     ```bash
     cp .env.example .env
     ```

  3. **Google Maps API Setup** (Required for address autocomplete):
     - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     - Create a new project or select an existing one
     - Enable the following APIs:
       - Places API
       - Maps JavaScript API
       - Geocoding API
     - Create an API key and add it to your `.env` file:
       ```
       VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
       ```
     - Restrict the API key to your domain for production

  ## Running the code

  Run `npm run dev` to start the development server.
  