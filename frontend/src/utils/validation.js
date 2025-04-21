export function validateInputValue(
  value,
  fieldName,
  minLength,
  maxLength,
  errors
) {
  const capitalizedFieldName =
    String(fieldName).charAt(0).toUpperCase() + String(fieldName).slice(1);

  if (value.trim() == "") {
    errors.push({
      message: `${capitalizedFieldName} can not be empty!`,
      testIdAttribute: `error-${fieldName}`,
      fieldName,
    });
    return false;
  }

  if (value.length < minLength || value.length > maxLength) {
    errors.push({
      message: `${capitalizedFieldName} name can only contain ${minLength} to ${fieldName} characters`,
      testIdAttribute: `error-${fieldName}`,
      fieldName,
    });
    return false;
  }
  return true;
}

export async function validateImageUrl(url, fieldName, errors) {
  const imageUrlRegex = /\.(jpeg|jpg|gif|png|webp)$/i;

  try {
    const response = await fetch(url, { method: "HEAD" });
    if ((response.ok && imageUrlRegex.test(url)) || url.trim() === "") {
      return true;
    } else {
      errors.push({
        message: `Cannot to get response from image url. Please provide a valid link or left the input empty. The cover will be set by default.`,
        testIdAttribute: `error-${fieldName}`,
        fieldName,
      });
      return false;
    }
  } catch (error) {
    errors.push({
      message: `Failed to load your image. Please provide a valid link or lef the input empty. The cover will be set by default. Error message: ${error}`,
      testIdAttribute: `error-${fieldName}`,
      fieldName,
    });
    return false;
  }
}

export function validateAudioFormat(file) {
  const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];

  if (!allowedMimeTypes.includes(file.type)) {
    return false
  }
  return true;
}

export function validateAudioSize(file){
  const maxAudioSize = 10 * 1024 * 1024;
  if (file.size > maxAudioSize) {
    return false;
  }
  return true;
}