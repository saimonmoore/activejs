/* ***** BEGIN LICENSE BLOCK *****
 * 
 * Copyright (c) 2008 Aptana, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * ***** END LICENSE BLOCK ***** */

/**
 * @namespace {ActiveRecord.Relationships}
 * 
 * Relationships are declared with one of three class methods that are available to all models:
 * 
 * 	- belongsTo
 * 	- hasMany
 * 	- hasOne
 * 
 * The related model name can be specified in a number of ways, assuming that you have a Comment model already declared, any of the following would work:
 * 
 * 	- User.hasMany(Comment)
 * 	- User.hasMany('Comment')
 * 	- User.hasMany('comment')
 * 	- User.hasMany('comments')
 * 
 * Each relationship adds various instance methods to each instance of that model. This differs significantly from the Rails "magical array" style of handling relatioship logic:
 * 	
 * 	Rails:
 * 		u = User.find(5)
 * 		u.comments.length
 * 		u.comments.create :title => 'comment title'
 * 	
 * 	ActiveRecord.js:
 * 		var u = User.find(5);
 * 		u.getCommentList().length;
 * 		u.createComment({title: 'comment title'});
 * 
*/
var Relationships = {
    normalizeModelName: function(related_model_name)
    {
        var plural = ActiveSupport.camelize(related_model_name, true);
        var singular = ActiveSupport.Inflector.singularize(plural);
        return singular || plural;
    },
    normalizeForeignKey: function(foreign_key, related_model_name)
    {
        var plural = ActiveSupport.underscore(related_model_name).toLowerCase();
        var singular = ActiveSupport.Inflector.singularize(plural);
        if (!foreign_key || typeof(foreign_key) == 'undefined')
        {
            return (singular || plural) + '_id';
        }
        else
        {
            return foreign_key;
        }
    }
};
ActiveRecord.Relationships = Relationships;