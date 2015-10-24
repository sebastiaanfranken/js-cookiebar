<?php

namespace Bolt\Extension\Sfranken\Cookiebar;

use Bolt\Application;
use Bolt\BaseExtension;

class Extension extends BaseExtension
{


    public function initialize() {
        $this->addCss('assets/cookiebar.css');
        $this->addSnippet('cookiebarconfig', 'getCookiebarPreferences');
        $this->addJavascript('assets/cookiebar.js', true);
    }

    public function getName()
    {
        return "cookiebar";
    }

    public function getCookiebarPreferences()
    {
        $html = '<script type="text/javascript">var cookiebarPreferences = %s</script>';

        return sprintf($html, json_encode($this->config));
    }

}
