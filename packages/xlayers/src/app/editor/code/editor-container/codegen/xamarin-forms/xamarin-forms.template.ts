export const readmeTemplate = () => {
    const codeBlock = '```';
    return `
  ## How to use the Xlayers Xamarin.Forms

  ${codeBlock}
    // Form.xaml
    blablabla
  ${codeBlock}
   `;
};

export const applicationTemplate = () => {
    return `
<?xml version="1.0" encoding="utf-8" ?>
<Application xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="testXamarin.App">
    <Application.Resources>
        <StyleSheet Source="/styles.css" />
    </Application.Resources>
</Application>
`
};

export const mainPageTemplate = `
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:testXamarin"
             x:Class="testXamarin.MainPage">
  <AbsoluteLayout>
{xamlContent}
  </AbsoluteLayout>
</ContentPage>`;
