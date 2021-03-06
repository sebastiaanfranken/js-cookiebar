<?php

namespace Bolt\Extension\Sfranken\Cookiebar;

use Bolt\Application;
use Bolt\BaseExtension;
use Bolt\Extensions\Snippets\Location;

class Extension extends BaseExtension
{


    public function initialize() {
        $this->addCss('assets/cookiebar.css');
        $this->addSnippet(Location::END_OF_HEAD, 'getCookiebarPreferences');
        $this->addJavascript('assets/cookiebar.js');
    }

    public function getName()
    {
        return "cookiebar";
    }

    public function getCookiebarPreferences()
    {
        $html = '<script type="text/javascript">window.cookiebarPreferences = %s</script>';

        return sprintf($html, json_encode($this->config));
    }

}
