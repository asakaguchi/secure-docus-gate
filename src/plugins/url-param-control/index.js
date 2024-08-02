export default function (context, options) {
  const validParamName = options.validParam;

  if (!validParamName) {
    throw new Error('Valid parameter name is not provided. Please check your configuration.');
  }

  return {
    name: 'url-param-control',
    
    async loadContent() {
      return {
        validParam: validParamName,
      };
    },

    async contentLoaded({ actions }) {
      const { setGlobalData } = actions;
      setGlobalData({
        validParam: validParamName,
      });
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
              (function() {
                function checkUrlParam() {
                  var urlParams = new URLSearchParams(window.location.search);
                  var validParam = '${validParamName}';
                  if (!urlParams.has(validParam)) {
                    return false;
                  }
                  var paramValue = urlParams.get(validParam);
                  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(paramValue);
                }

                if (!checkUrlParam() && window.location.pathname !== '/404') {
                  window.location.href = '/404' + window.location.search;
                }
              })();
            `,
          },
        ],
      };
    },
  };
}