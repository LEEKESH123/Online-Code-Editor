document.addEventListener("DOMContentLoaded", function () {
    const htmlEditor = CodeMirror.fromTextArea(document.getElementById("HTML-CODE"), {
        mode: "htmlmixed",
        lineNumbers: true,
        theme: localStorage.getItem('theme') === 'dark' ? "darcula" : "default",
    });

    const cssEditor = CodeMirror.fromTextArea(document.getElementById("CSS-CODE"), {
        mode: "css",
        lineNumbers: true,
        theme: localStorage.getItem('theme') === 'dark' ? "darcula" : "default",
    });

    const jsEditor = CodeMirror.fromTextArea(document.getElementById("JavaScript-CODE"), {
        mode: "javascript",
        lineNumbers: true,
        theme: localStorage.getItem('theme') === 'dark' ? "darcula" : "default",
    });

    function run() {
        const htmlCode = prettier.format(htmlEditor.getValue(), { parser: "html", plugins: prettierPlugins });
        const cssCode = prettier.format(cssEditor.getValue(), { parser: "css", plugins: prettierPlugins });
        const jsCode = prettier.format(jsEditor.getValue(), { parser: "babel", plugins: prettierPlugins });

        const output = document.getElementById("output");

        const completeCode = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>${cssCode}</style>
            </head>
            <body class="${document.body.classList.contains('dark-mode') ? 'dark-output' : ''}">
                ${htmlCode}
                <script>${jsCode}<\/script>
            </body>
            </html>
        `;

        output.contentDocument.open();
        output.contentDocument.write(completeCode);
        output.contentDocument.close();
    }

    // Update output when content changes
    htmlEditor.on("change", run);
    cssEditor.on("change", run);
    jsEditor.on("change", run);

    // Load saved code from localStorage
    htmlEditor.setValue(localStorage.getItem("htmlCode") || "");
    cssEditor.setValue(localStorage.getItem("cssCode") || "");
    jsEditor.setValue(localStorage.getItem("jsCode") || "");

    window.saveCode = function () {
        localStorage.setItem("htmlCode", htmlEditor.getValue());
        localStorage.setItem("cssCode", cssEditor.getValue());
        localStorage.setItem("jsCode", jsEditor.getValue());
    };

    window.beautifyCode = function () {
        htmlEditor.setValue(prettier.format(htmlEditor.getValue(), { parser: "html", plugins: prettierPlugins }));
        cssEditor.setValue(prettier.format(cssEditor.getValue(), { parser: "css", plugins: prettierPlugins }));
        jsEditor.setValue(prettier.format(jsEditor.getValue(), { parser: "babel", plugins: prettierPlugins }));
    };

    window.toggleMode = function () {
        document.body.classList.toggle("dark-mode");

        const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("theme", theme);

        [htmlEditor, cssEditor, jsEditor].forEach(editor => {
            editor.setOption("theme", theme === "dark" ? "darcula" : "default");
        });

        run(); // Update output to match the mode
    };

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    run();
});
