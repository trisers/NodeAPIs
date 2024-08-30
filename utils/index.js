/**
 * Converts a string to a URL-friendly slug.
 * @param {string} str - The string to convert.
 * @returns {string} - The generated slug.
 */
export const createSlug = (str) => {
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return str;
};

/**
 * Check for required fields
 * @param {Object} required - Object containing required fields
 * @param {Object} body - Object containing the request body to validate
 * @returns {string} - Message for missing or empty values
 */
export const validateRequestBody = (required, body) => {
  const missingFields = [];

  for (const [field, isRequired] of Object.entries(required)) {
    if (isRequired && (!body.hasOwnProperty(field) || !body[field])) {
      // Collect missing or empty fields
      missingFields.push(field.replace(/_/g, " ")); // Convert snake_case to space-separated words
    }
  }

  if (missingFields.length > 0) {
    return `Missing - ${missingFields.join(", ")}`;
  }

  return "";
};
