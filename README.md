# Pagela Confluence Macro
> A Confluence app (or macro) allowing to add from a configured list of labels one or multiple of these to pages. 

[![Confluence Version][conf-image]][conf-url]

This Confluence app allows to add a macro to a page with labels that can be configured. The rendered result is a form that allows users to add one or more of the predefined labels to be added to any page.
Thus the macro allows to curate labels for certain pages. One use case could be to setup a skills database where users can select from a list to add labels (i.e. skills) to a page (i.e. their personal page). Thereby different spellings (of labels) can be avoided.

The macro provides texts in German or English.

![Pagela-Form1](src/main/resources/images/pagela-macro1.png)
![Pagela-Form2](src/main/resources/images/pagela-form1.png)

## Installation

Setup Atlassian's SDK developer environment as mentioned under [Development setup](#dev).

Then execute the following command:

```sh
atlas-package
```

This generates a jar file within Maven's target folder. The file can be uploaded as an app in Confluence's "Manage apps" administrative menu. For more details, see [Installing Marketplace apps - Installing by file upload][conf-install-app].

## Usage example

Create a page in Confluence. In the macro browser, search for "pagela". In the setup dialog, add any amount of labels and optionally customize the form's texts.

Save the page with the pagela macro and switch page to the actual view of the page. It will now display a form with two input fields and a button for submission.

The first field allows to select a page to which the labels should be added do. The second field allows to select one or multiple of the labels, that were configured during the macro setup.

Upon submitting the form, the label(s) will be added to the specified page. In case there is an issue with the request, appropriate messages will issues to the user.

## <a name="dev"></a>Development setup

Please see Atlassian's [Getting started][conf-dev] guidelines on SDK development for details on how to setup the environment. This provides the ```atlas-*``` commands.

Then execute the following command:

```sh
atlas-run
```

This launches a developer Confluence instance.

Though the macro was manually tested during development, there are currently no tests yet.

## More

Annabell Langs - [annabell.langs.de](http://www.annabell.langs.de)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/alangs/pagela-macro](https://github.com/dbader/)

## Contributing

This app is still under development.

I am happy to hear your feedback. Please get in contact if you have found a bug or simply follow the general GitHub process below:

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Attribution

Pagela icon from [iconmonstr][icon]

<!-- Markdown link & img dfn's -->
[conf-image]: https://img.shields.io/badge/Confluence-6.14.1-green.svg
[conf-url]: https://atlassian.com/software/confluence
[conf-dev]: https://developer.atlassian.com/server/framework/atlassian-sdk/
[conf-install-app]: https://confluence.atlassian.com/upm/installing-add-ons-273875715.html
[icon]: https://iconmonstr.com/
[langs]: http://www.annabell.langs.de
