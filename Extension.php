<?php

namespace Bolt\Extension\Sfranken\Cookiebar;

use Bolt\Application;
use Bolt\BaseExtension;

class Extension extends BaseExtension
{


    public function initialize() {
        $this->addCss('assets/cookiebar.css');
        $this->addJavascript('assets/cookiebar.js');
    }

    public function getName()
    {
        return "cookiebar";
    }

}
