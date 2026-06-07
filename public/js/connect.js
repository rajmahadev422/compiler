async function runCode(code, input) {
  
  try {
    const res = await fetch("/run-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code, input: input }),
    });

    if (!res.ok) {
      console.log(res.statusText);
    }

    const result = await res.json();

    if (result.error) {
      console.log(result.error);
      return result.error;
    }
    
    return result.output;
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
}
