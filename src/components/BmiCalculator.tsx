// Native SEO & JSON-LD Head Injector (Updated Schema)
  useEffect(() => {
    // 1. Update Title
    document.title = "Body Mass Index (BMI) Calculator | Health & Wellness Calculator";

    // 2. Update Description Meta Tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content', 
      "Calculate your Body Mass Index (BMI) instantly. Supports both Metric and Imperial units for weight and height with immediate WHO health categorization."
    );

    // 3. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', "https://universal-tools-platform.pages.dev/bmi-calculator");

    // 4. Inject strict WebApplication JSON-LD Schema (Fixes missing/invalid field errors)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Body Mass Index (BMI) Calculator",
      "url": pageUrl,
      "description": "Calculate your Body Mass Index (BMI) instantly. Supports both Metric and Imperial units for weight and height with immediate WHO health categorization.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5/JavaScript",
      "inLanguage": "en",
      "usageInfo": "Enter height and weight to calculate BMI instantly."
    };

    let scriptTag = document.getElementById('bmi-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'bmi-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(schemaData);

  }, [pageUrl]);
