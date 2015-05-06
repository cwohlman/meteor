if (Meteor.isClient) {

  Tinytest.add("blaze - domrange - containsElement", function (test) {
    var v = Blaze.View(function () {
      return HTML.P();
    });

    var outer = document.createElement("DIV");
    var div = document.createElement("DIV");

    outer.appendChild(div);

    Blaze.render(v, div);

    var child = div.childNodes[0];
    test.equal(v._domrange.containsElement(child), true);

    div.removeChild(child);
    test.equal(v._domrange.containsElement(child), false);

    var other = document.createElement("DIV");
    outer.appendChild(other);
    test.equal(v._domrange.containsElement(other), false);

    div.appendChild(child);
    test.equal(v._domrange.containsElement(child), true);

    outer.removeChild(other);
    div.appendChild(other);
    test.equal(v._domrange.containsElement(other), false);

    div.removeChild(other);
    child.appendChild(other);
    test.equal(v._domrange.containsElement(other), true);

    $(child).wrap('<div>');
    test.equal(v._domrange.containsElement(child), true);
  });

}
