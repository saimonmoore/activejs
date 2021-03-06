/* ***** BEGIN LICENSE BLOCK *****
 * 
 * Copyright (c) 2009 Aptana, Inc.
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

ActiveTest.Tests.ActiveRecord.relationships = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            //has many
            var abbey = User.create({
                name: 'Abbey'
            });
            var bailey = User.create({
                name: 'Bailey'
            });

            assert(
                typeof(bailey.getPostList) == 'function' &&
                typeof(bailey.getPostCount) == 'function' &&
                typeof(bailey.destroyPost) == 'function' &&
                typeof(bailey.createPost) == 'function' &&
                typeof(bailey.buildPost) == 'function'
            ,'hasMany methods created.');

            var count = bailey.getPostCount();
            assert(count == 0,'hasMany get#{X}Count()');
            var x = bailey.buildPost({
                title: 'x'
            });
            assert(!x.id && x.user_id == bailey.id,'hasMany build#{X}()')
            var a = bailey.createPost({
                title: 'a'
            });
            
            assert(a.user_id == bailey.id && bailey.getPostCount() == count + 1,'hasMany create#{X}()');
            var b = bailey.createPost({
                title: 'b'
            });
            var list = bailey.getPostList();
            assert(list.length == 2 && list[0].title == 'a' && bailey.getPostList({
                order: 'id DESC'
            })[0].title == 'b','hasMany get#{X}List()');

            bailey.destroyPost(b);
            assert(User.find(bailey.id) && Post.find(a.id) && !Post.find(b.id),'hasMany destroy#{X}()');

            var z = bailey.createPost({
                title: 'z'
            });
            var x = bailey.createPost({
                title: 'x'
            });
            bailey.reload();
            
            var count_one = (bailey.getPostCount() == 3 && bailey.post_count == 3);
            x.destroy();
            bailey.reload();
            
            var count_two = (bailey.getPostCount() == 2 && bailey.post_count == 2);
            assert(count_one && count_two,'hasMany counter');

            bailey.destroy();
            assert(!z.reload() && !Post.find(x.id) && !User.find(bailey.id),'hasMany dependents destroyed');

            //belongs to
            var x = abbey.createPost({
                title: 'x'
            });
            assert(
                typeof(x.getUser) == 'function' &&
                typeof(x.buildUser) == 'function' &&
                typeof(x.createUser) == 'function'
            ,'belongsTo methods created.');

            assert(x.getUser().id == abbey.id,'belongsTo get#{X}()')

            var y = Post.create({
                title: 'y'
            });
            var colin = y.createUser({
                name: 'colin'
            });
            assert(y.user_id == colin.id && Post.find(y.id).user_id == colin.id,'belongsTo create#{X}()');

            //has one
            assert(
                typeof(abbey.getCreditCard) == 'function' &&
                typeof(abbey.buildCreditCard) == 'function' &&
                typeof(abbey.createCreditCard) == 'function'
            ,'hasOne methods created.');

            var before = abbey.getCreditCard();
            var credit_card = abbey.createCreditCard({
                number: '0001'
            });
            assert(credit_card.id == abbey.getCreditCard().id && !before,'hasOne get#{X}() and create#{X}()');
            abbey.destroy();
            assert(!CreditCard.find(credit_card.id),'hasOne dependent destroyed');
            
            //has many through
            var a = Article.create({
                name: 'sports are great'
            });
            var b = Article.create({
                name: 'sports are boring in england'
            });
            var c = Article.create({
                name: 'england is great'
            });
            
            var sports = Category.create({
                name: 'sports'
            });
            var england = Category.create({
                name: 'england'
            });
            
            Categorization.create({
                category_id: sports.id,
                article_id: a.id
            });
            Categorization.create({
                category_id: sports.id,
                article_id: b.id
            });
            Categorization.create({
                category_id: england.id,
                article_id: b.id
            });
            Categorization.create({
                category_id: england.id,
                article_id: c.id
            });
                        
            assert(a.getCategorizationCount() == 1 && b.getCategorizationCount() == 2,'has many through, regular has many in tact');
            assert(typeof(a.getCategoryList) == 'function' && typeof(a.getCategoryCount) == 'function','has many through generates correct methods');
            assert(a.getCategoryList()[0].name == 'sports' && b.getCategoryList()[1].name == 'england' && b.getCategoryCount() == 2,'has many through returns proper results')
            
            if(proceed)
                proceed();
        }
    }
};
